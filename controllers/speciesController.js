require('dotenv').config();

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

    const { speciesScientificName, speciesName, speciesInfo } = req.body;


    // !!!!! NEED TO CHANGE THIS ONCE WE HAVE IMAGES !!!!!
    const speciesImage = [];
    speciesImage[0] = req.query.speciesImage;
    //list of Quest IDs related to this species

    await speciesCollection.updateOne(
        { speciesName: speciesName },
        {
            $set: {
                speciesInfo: speciesInfo,
                speciesImage: speciesImage,
                speciesLocation: speciesLocation,
                speciesQuantity: speciesQuantity,
                speciesQuests: speciesQuests,
                speciesScientificName: speciesScientificName
            }
        }
    );
    next();
}

const getSpecies = async (req, res) => {
    const speciesScientificName = req.query.q;

    console.log("getSpecies");

    if (!speciesScientificName) {
        return res.status(400).json({ error: "Missing query" });
    }

    const species = await speciesCollection.findOne({ speciesScientificName });

    if (species) {
        res.status(200).json([species]); // return as array for consistency with frontend
    } else {
        res.json([]); // return empty array if no match
    }
};

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

const deleteSpecies = async (req, res) => {
    const speciesName = req.query.speciesName;
    const species = await speciesCollection.findOne({ speciesName: speciesName });
    if (species) {
        await speciesCollection.deleteOne({ speciesName: speciesName });
        res.status(200).json({ message: "Species deleted successfully" });
    } else {
        res.status(404).json({ message: "Species not found" });
    }
}

module.exports = { createSpecies, updateSpecies, getSpecies, deleteSpecies };