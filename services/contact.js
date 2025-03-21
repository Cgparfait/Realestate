const db = require('../config/db');
const Contact = require('../models/contacts');

const update_contact_information = (email, phone, address) => {
    const newContact = new Contact({
        email: email,
        phone: phone,
        address: address
    })
    newContact.save().then((contact) => {
        console.log('New contact saved: ');
        delete_all_except(contact._id)
    }).catch(err => console.log('Error saving contact ' + err));
}

const get_contact_information = async () => {
    try {
        const contacts = await Contact.find()
        return contacts[0]
    } catch (error) {
        console.log("couldn't get contact info: ", error)
        return null
    }
}

function delete_all_except(id) {
    Contact.deleteMany({ _id: { $ne: id } })
        .then(() => console.log("Deleted all except " + id))
        .catch((err) => console.error(err))
}


module.exports = { update_contact_information, get_contact_information }