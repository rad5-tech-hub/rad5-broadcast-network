import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string().required().min(3),
  email: Joi.string().required().email().min(6),
  password: Joi.string().required().min(6),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9]{10,15}$/)
    .message('Phone number must be 11 to 15 digits long'),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email().trim().lowercase(),
  password: Joi.string().required().min(6),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().required().email().trim().lowercase(),
});

// export const resetPasswordSchema = Joi.object({
//   password: Joi.string().min(6).required(),
//   confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
//     "any.only": "Passwords do not match",
//   }),
// });

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({
      'any.only': '{{#label}} does not match',
    }),
});

const singleAvailabilitySchema = Joi.object({
  dayOfWeek: Joi.string()
    .valid(
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    )
    .required(),
  startTime: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  endTime: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  date: Joi.date().optional(), // Optional if you're not using it in DB
});

export const createAvailabilitySchema = Joi.object({
  availability: Joi.array().items(singleAvailabilitySchema).required(),
});

export const createBookingSchema = Joi.object({
  tutorId: Joi.string().uuid().required(),
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/) // 24hr HH:mm
    .required(),
  endTime: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .required(),
});

//wallet validation
export const markUserAsPaidSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amountPaid: Joi.number().positive().required(),
  commissionRate: Joi.number().min(0).max(1).optional(),
});

export const withdrawalRequestSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().allow('', null),
  bankName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  accountName: Joi.string().required(),
});

//user validation
export const registerUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
  }),
  phoneNumber: Joi.string().min(7).required().messages({
    'string.empty': 'Phone number is required',
    'string.min': 'Phone number is too short',
  }),
  track: Joi.string().required().messages({
    'string.empty': 'Track is required',
  }),
});



/**====course input validation starts here */
export const createCourseSchema = Joi.object({
  courseName: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Course name must be a string',
    'string.empty': 'Course name is required',
    'string.min': 'Course name must be at least 3 characters',
    'any.required': 'Course name is required',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive value',
    'any.required': 'Course price is required',
  }),
  courseDuration: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Course duration must be a string',
    'string.empty': 'Course duration is required',
    'string.min': 'Course duration must be at least 2 characters',
    'any.required': 'Course duration is required',
  }),
});
/**======ends here===== */

