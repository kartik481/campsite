const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)

module.exports.campSchema = joi.object({
    camp: joi.object({
        name: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        description: joi.string().required().escapeHTML()
        // image: joi.string().required()

    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object(
        {
            comment: joi.string().required().escapeHTML(),
            rating: joi.number().required().min(1).max(5)
        }
    ).required()
})

module.exports.userSchema = joi.object({
    review: joi.object(
        {
            username: joi.string().required().escapeHTML(),
            email: joi.string().email({minDomainSegments:2, tlds:{allow:['com', 'net']}}).required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        }
    ).required()
})

