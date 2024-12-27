class createError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default createError;  // Exporting the class for use in other modules.  The 'exports' keyword is used to make the class available to other files.  'creatError' is the name we're assigning to the class.  This makes it easier to reference the class elsewhere in your codebase.  For example, in a separate file, you can use 'const creatError = require('./creatError');' to import the class.
