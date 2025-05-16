require('dotenv').config();
const { ObjectId } = require('mongodb');

const appClient = require('../databaseConnection').database;
const speciesCollection = appClient.db('biodiversityGo').collection('species');

// Configure Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const createSpecies = async (req, res, next) => {
    try {
        console.log("createSpecies");
        console.log(req.body);
        const { speciesScientificName, speciesName, speciesInfo} = req.body;

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
        }
        //This fields are set to null until updated by quests
        const speciesImage = [];
        speciesImage[0] = speciesImageUrl;
        const speciesQuests = [];
        const speciesLocations = {};
        const speciesQuantity = 0;

        await speciesCollection.insertOne({
            speciesName: speciesName,
            speciesInfo: speciesInfo,
            speciesImage: speciesImage,
            speciesLocation: speciesLocations,
            speciesQuantity: speciesQuantity,
            speciesQuests: speciesQuests,
            speciesScientificName: speciesScientificName
        });
        next();
    } catch (error) {
        console.error("Error in addSpecies controller:", error);
        // Consider sending a user-friendly error page or message
        res.status(500).send("Error adding species. " + error.message);
    }
}

//This updates the same fields as createSpecies
// NEED TO FIGURE OUT HOW CHANGING THE IMAGE WORKS
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

const getSpecies = async (req, res) => {
    const speciesScientificName = req.query.speciesScientificName;
    const species = await speciesCollection.findOne({ speciesName: speciesScientificName });
    if (species) {
        res.status(200).json(species);
    } else {
        res.status(404).json({ message: "Species not found" });
    }
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
}

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