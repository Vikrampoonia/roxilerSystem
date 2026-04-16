import constants from "./constants.js";

class Message {
    constructor() {
        this.invalidLoginCredentials = "Invalid login credentials";
        this.invalidSignupCredentials = "Invalid signup credentials";
        this.unableToSignup = "Unable to signup";
        this.successfullLogin = "Login successful";
        this.successfullLogout = "Logout successful";
        this.signupSuccessful = "Signup successful";
        this.unableToLogout = "Unable to logout";
        this.userCreatedSuccessfully = "User created successfully";
        this.usersFetchedSuccessfully = "Users fetched successfully";
        this.userDetailFetchedSuccessfully = "User detail fetched successfully";
        this.storeCreatedSuccessfully = "Store created successfully";
        this.storesFetchedSuccessfully = "Stores fetched successfully";
        this.userStoresFetchedSuccessfully = "Stores fetched successfully";
        this.ratingAddedSuccessfully = "Rating added successfully";
        this.ratingUpdatedSuccessfully = "Rating updated successfully";
        this.dashboardSummaryFetchedSuccessfully = "Dashboard summary fetched successfully";
        this.emailAlreadyExists = "Email already exists";
        this.storeEmailAlreadyExists = "Store email already exists";
        this.ownerNotFound = "Store owner not found";
        this.ownerRoleInvalid = "Selected owner must be a Store Owner";
        this.storeNotFound = "Store not found";
        this.ratingAlreadySubmitted = "Rating already submitted for this store";
        this.ratingNotFound = "Rating not found for this store";
        this.profileUpdatedSuccessfully = "Profile updated successfully";
        this.unableToUpdateProfile = "Unable to update profile";
        this.userNotFound = "User not found";

        this.validation = {
            nameTooShort: `Name must be at least ${constants.limits.NAME_MIN} characters`,
            nameTooLong: `Name must be at most ${constants.limits.NAME_MAX} characters`,
            emailInvalid: "Email must be a valid email address",
            addressTooLong: `Address must be at most ${constants.limits.ADDRESS_MAX} characters`,
            passwordTooShort: `Password must be at least ${constants.limits.PASS_MIN} characters`,
            passwordTooLong: `Password must be at most ${constants.limits.PASS_MAX} characters`,
            passwordUppercase: "Password must contain at least one uppercase letter",
            passwordSpecial: "Password must contain at least one special character (!@#$%^&*)",
            atLeastOneFieldRequired: "At least one field (name, address, or password) must be provided for update",
        };
    }
}
export default new Message();