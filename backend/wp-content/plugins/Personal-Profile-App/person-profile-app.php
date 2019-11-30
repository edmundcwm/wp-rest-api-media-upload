<?php
/**
 * Plugin Name: Personal Profile App
 * Description: Customise Users Endpoint for Profile Image upload
 * Author: Edmundcwm
 * Author URI: https://edmundcwm.com
 * Version: 0.1
 */

/**
 * Register field for storing Profile Image URL
 */
function ppa_register_rest_fields() {
	register_rest_field( 'user', 'profile_image', array(
		'get_callback' => 'ppa_get_user_profile_image',
		'update_callback' => 'ppa_update_user_profile_image',
	));
}
add_action( 'rest_api_init', 'ppa_register_rest_fields' );

/**
 * Retrieve 'Profile Image' URL
 */
function ppa_get_user_profile_image( $object ) {
	//get user id
	$userid = $object['id'];
	
	if ( ! $userid || ! is_int( $userid ) ) {
		return new WP_Error( 'invalid_user', __( 'Invalid User ID.' ), array( 'status' => 400 ) );
	}

	//return user 'profile_image' meta
	return get_user_meta( $userid, 'profile_image', true );
}

/**
 * Update 'Profile Image' URL
 */
function ppa_update_user_profile_image( $value, $object, $field ) {
	// //get user id
	$userid = $object->ID;
	if ( ! $userid || ! is_int( $userid ) ) {
		return new WP_Error( 'invalid_user', __( 'Invalid User ID.' ), array( 'status' => 400 ) );
	}

	//return user 'profile_image' meta
	return update_user_meta( $userid, $field, esc_url( $value ) );
}
