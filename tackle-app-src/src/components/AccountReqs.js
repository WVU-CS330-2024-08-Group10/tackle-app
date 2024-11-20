export const usernameReqs = {
    minLength: 4,
    maxLength: 20,
    regEx: /^[a-zA-Z0-9-_]*$/
}

export const passwordReqs = {
    minLength: 4,
    maxLength: 32,
    regExOnlyASCII: /^[ -~]*$/,
    regExNoSpaces: /^\S*$/
}