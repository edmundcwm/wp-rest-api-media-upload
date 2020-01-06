(function() {
  /*******************
   * VARIABLES       *
   ******************/
  const rootURL = 'http://localhost:8888/wp-rest-api-upload-media/backend';
  const mediaEndpoint = rootURL + '/wp-json/wp/v2/media';
  const userEndpoint = rootURL + '/wp-json/wp/v2/users/me';

  const wrapper = document.getElementById('profile-wrapper');
  const form = document.getElementById('profile-form');
  const name = document.getElementById('name');
  const description = document.getElementById('description');
  const profilePic = document.getElementById('profile-pic');
  const profilePicInput = document.getElementById('profile-pic-input');
  const spinner = document.getElementById('spinner');
  const fileLabel = document.querySelector('.custom-file-label');

  /*******************
   * FUNCTIONS       *
   ******************/

  //Handle fetching of data from server
  function getData() {
    //hide Card display to mimic loading
    wrapper.style.opacity = 0;
    fetch(userEndpoint + '?context=edit', {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + window.btoa('admin:password')
      }
    })
      .then(res => res.json())
      .then(data => {
        //re-display card after response is received
        wrapper.style.opacity = 1;
        name.innerHTML = `${data.last_name} ${data.first_name}`;
        description.innerHTML = data.description;
        profilePic.innerHTML = data.profile_image
          ? `<img class="card-img-top" src="${data.profile_image}" alt="${data.last_name}" />`
          : 'No Image found';
      })
      .catch(err => {
        console.log(err);
      });
  }

  //Toggle spinner
  function toggleSpinner() {
    return spinner.classList.contains('visible')
      ? spinner.classList.replace('visible', 'invisible')
      : spinner.classList.replace('invisible', 'visible');
  }

  /*******************
   * EVENT HANDLERS  *
   ******************/

  //By default, Bootstrap's custom File input doesn't display the chosen file name.
  //Hence this event handler is required.
  profilePicInput.addEventListener('change', function(e) {
    fileLabel.textContent = e.target.files[0].name;
  });

  //Submit image to media library
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', profilePicInput.files[0]);
    //display spinner
    toggleSpinner();
    //send image to media library
    fetch(mediaEndpoint, {
      method: 'POST',
      headers: {
        //when using FormData(), the 'Content-Type' will automatically be set to 'form/multipart'
        //so there's no need to set it here
        Authorization: 'Basic ' + window.btoa('admin:password')
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const input = {
          profile_image: data.source_url
        };
        //send image url to backend
        fetch(userEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + window.btoa('admin:password')
          },
          body: JSON.stringify(input)
        })
          .then(res => res.json())
          .then(data => {
            //clear file input text content
            fileLabel.textContent = '';
            //hide spinner
            toggleSpinner();
            //close modal
            $('#exampleModal').modal('hide');
            //re-fetch data from server
            getData();
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  //fetch data on load
  getData();
})();
