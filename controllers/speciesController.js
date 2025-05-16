const Species = require('../models/specieModel');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadImageToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

const getSpecies = async (req, res, next) => {
    try {
        const speciesList = await Species.find();
        // Attach the species list to `res.locals` to pass to the route/render layer
        res.locals.speciesList = speciesList;
        next();
    } catch (err) {
        console.error("Error fetching species list:", err);
        res.status(500).send("Error fetching species list");
    }
};

const createSpecies = async (req, res, next) => {
    try {
        const { speciesScientificName, speciesName, speciesInfo, speciesHabitat,speciesType } = req.body;

        let speciesImage = [];
        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(req.file.buffer);
            speciesImage.push(imageUrl);
        }
        const createdBy = req.session.userId;
        const newSpecies = new Species({
            speciesScientificName,
            speciesName,
            speciesInfo,
            speciesImage,
            speciesHabitat,
            speciesType,
            createdBy,
        });

        await newSpecies.save();
        next(); // or res.status(201).json(newSpecies);
    } catch (error) {
        console.error("Error creating species:", error);
        res.status(500).send("Error adding species. " + error.message);
    }
};

const updateSpecies = async (req, res, next) => {
    const speciesId = req.params.id;
    const { speciesScientificName, speciesName, speciesInfo } = req.body;

    const speciesImageUrl = await addImage(req, res, next);

    const updateFields = {
        speciesName: speciesName,
        speciesInfo: speciesInfo,
        speciesScientificName: speciesScientificName
    };

    if (speciesImageUrl) {
        updateFields.speciesImage = speciesImageUrl;
    }

    await speciesCollection.updateOne(
        { _id: new ObjectId(speciesId) },
        { $set:updateFields }
    );
    next();
}

// POSSIBLY GOOD FOR REUSING IN UPDATE SPECIES AND CREATE SPECIES
const addImage = async (req, res, next) => {
    let speciesImageUrl = null;

    // Check if a file was uploaded
    if (req.file) {
        // Upload image to Cloudinary from buffer
        // Giving it a unique public_id using field (e.g. speciesName if unique) and timestamp might be good
        // For simplicity, letting Cloudinary auto-generate public_id
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' }, // Can add folder: 'species_images' for organization
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });
        speciesImageUrl = result.secure_url;
        return speciesImageUrl;
    }
};

// const getSpecies = async (req, res) => {
//     try {
//         const speciesScientificName = req.query.speciesScientificName;
//         const species = await Species.findOne({ speciesScientificName });
//         if (!species) {
//             return res.status(404).json({ message: "Species not found" });
//         }
//         res.status(200).json(species);
//     } catch (error) {
//         console.error("Error fetching species:", error);
//         res.status(500).send("Error fetching species. " + error.message);
//     }
// };

// DeleteFunction that deletes species data in mongoDB.
const deleteSpecies = async (req, res, next) => {
    const speciesId = req.params.id;
    const objectId = new ObjectId(speciesId);
    const species = await speciesCollection.findOne({ _id: objectId });
    if (species) {
        await speciesCollection.deleteOne({ _id: objectId });        
    }
    next();
}

module.exports = { createSpecies, updateSpecies, getSpecies, deleteSpecies };
