const crypto = require('crypto');

const generateTempPassword = (length = 12) => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

    let password = '';

    // Ensure at least one character from each category
    password += uppercaseChars[crypto.randomInt(uppercaseChars.length)];
    password += lowercaseChars[crypto.randomInt(lowercaseChars.length)];
    password += numberChars[crypto.randomInt(numberChars.length)];
    password += specialChars[crypto.randomInt(specialChars.length)];

    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
        password += allChars[crypto.randomInt(allChars.length)];
    }

    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/;

// Function to test a password against the regex
function isPasswordValid(password) {
  return passwordRegex.test(password);
}

module.exports = { generateTempPassword, passwordRegex, isPasswordValid };