/**
 * Entity representing a User in the IAM context.
 */
export class User {
  /**
   * @param {Object} params
   * @param {number} params.id Unique identifier for the user.
   * @param {string} params.email User's email address.
   * @param {string} params.password User's hashed password.
   * @param {string} params.phoneNumber User's contact phone number.
   * @param {'Restaurant' | 'Supplier'} params.role User's organizational role.
   * @param {'Premium' | 'Enterprise'} params.subscription User's subscription tier.
   */
  constructor({ id, email, password, phoneNumber, role, subscription }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.subscription = subscription;
  }
}
