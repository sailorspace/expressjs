
export const uservalidationscheme = {
    name: {
        isLength: {
            options: {
                min: 3,
                max: 12,
            },
            errorMessage: "name must be between 3 to 12 characters long",
        },
        notEmpty: {
            errorMessage: "name cannot be empty",
        },
        isString: {
            errorMessage: "name must be a string value",
        },

    },

    city: {
        notEmpty: true,
    }
};