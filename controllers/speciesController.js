const Species = require('../models/specieModel');
require('dotenv').config();
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
    try {
        const { speciesScientificName, speciesName, speciesInfo, speciesLocation } = req.body;

        const species = await Species.findOne({ speciesName });
        if (!species) {
            return res.status(404).json({ message: "Species not found" });
        }

        species.speciesScientificName = speciesScientificName || species.speciesScientificName;
        species.speciesInfo = speciesInfo || species.speciesInfo;
        species.speciesLocation = speciesLocation || species.speciesLocation;

        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(req.file.buffer);
            species.speciesImage.push(imageUrl);
        }

        await species.save();
        next(); // or res.status(200).json(species);
    } catch (error) {
        console.error("Error updating species:", error);
        res.status(500).send("Error updating species. " + error.message);
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

const deleteSpecies = async (req, res) => {
    try {
        const speciesName = req.query.speciesName;
        const species = await Species.findOne({ speciesName });
        if (!species) {
            return res.status(404).json({ message: "Species not found" });
        }
        await species.deleteOne();
        res.status(200).json({ message: "Species deleted successfully" });
    } catch (error) {
        console.error("Error deleting species:", error);
        res.status(500).send("Error deleting species. " + error.message);
    }
};

module.exports = { createSpecies, updateSpecies, getSpecies, deleteSpecies };
