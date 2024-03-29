/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';
/* IMPORT HELPER FUNCTIONS //////////////////// */
import { normalizeData, slugify } from '../utils/helpers.js';
/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

export default {
  async create(reqBody, reqFile) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      firstname, surname, description, email, pseudonym, website, facebook, instagram, twitter, youtube,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateFirstname(firstname);
    validator.validateSurname(surname);
    validator.validateDescription(description);
    validator.validateEmail(email);
    if (pseudonym) validator.validateName(pseudonym);
    if (website) validator.validateWebsite(website);
    if (facebook) validator.validateSocialMedia(facebook, 'facebook');
    if (instagram) validator.validateSocialMedia(instagram, 'instagram');
    if (twitter) validator.validateSocialMedia(twitter, 'twitter');
    if (youtube) validator.validateSocialMedia(youtube, 'youTube');
    validator.validateFileImage(reqFile, ['image']);

    // 4. Create document object
    const document = {
      firstname,
      surname,
      description,
      email,
    };
    if (pseudonym) document.pseudonym = pseudonym;
    if (website) document.website = website;
    if (facebook) document.facebook = facebook;
    if (instagram) document.instagram = instagram;
    if (twitter) document.twitter = twitter;
    if (youtube) document.youtube = youtube;

    // 5. Resize image & save to disk & update document
    await processFile.resizeSavePhoto('artistes', 'image')(`${document.firstname} ${document.surname}`, reqFile);
    document.image = reqFile.filename;

    // 6. Add additional fields
    document.slug = slugify(`${document.firstname} ${document.surname}`);
    document.createdAt = new Date();
    document.active = true;

    // 7. Return document
    return document;
  },

  async update(reqBody, reqFile) {
    // 1. Normalize data
    const reqBodyNormalized = normalizeData(reqBody);

    // 2. Select allowed fields
    const {
      firstname, surname, description, email, pseudonym, website, facebook, instagram, twitter, youtube, active,
    } = reqBodyNormalized;

    // 3. Validate input and return errors if any
    validator.validateFirstname(firstname);
    validator.validateSurname(surname);
    validator.validateDescription(description);
    validator.validateEmail(email);
    if (pseudonym) validator.validateName(pseudonym);
    if (website) validator.validateWebsite(website);
    if (facebook) validator.validateSocialMedia(facebook, 'facebook');
    if (instagram) validator.validateSocialMedia(instagram, 'instagram');
    if (twitter) validator.validateSocialMedia(twitter, 'twitter');
    if (youtube) validator.validateSocialMedia(youtube, 'youTube');
    if (reqFile) validator.validateFileImage(reqFile, ['image']);
    validator.validateBoolean(reqBodyNormalized.active);

    // 4. Create document object
    const document = {
      firstname,
      surname,
      description,
      email,
      active,
    };
    if (pseudonym) document.pseudonym = pseudonym;
    if (website) document.website = website;
    if (facebook) document.facebook = facebook;
    if (instagram) document.instagram = instagram;
    if (twitter) document.twitter = twitter;
    if (youtube) document.youtube = youtube;

    // 5. Resize image & save to disk & update document
    if (reqFile) await processFile.resizeSavePhoto('artistes', 'image')(`${document.firstname} ${document.surname}`, reqFile);
    if (reqFile) document.image = reqFile.filename;

    // 6. Add additional fields
    document.slug = slugify(`${document.firstname} ${document.surname}`);

    // 7. Return document
    return document;
  },
};
