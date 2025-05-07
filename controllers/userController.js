//logic related to common routes like login... goes here

// Species routes
const getSpecies = async (req, res) => {
  const speciesList = await speciesCollection.find().toArray();
  res.render("pages/species", { species: speciesList });
};

app.get("/add-species", isAuthenticated, (req, res) => {
  res.render("add-species");
});

app.post("/add-species", async (req, res) => {
  const newSpecies = {
    commonName: req.body.commonName,
    scientificName: req.body.scientificName,
    image: req.body.image,
    description: req.body.description,
    location: {
      center: {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng)
      },
      rangeKm: parseFloat(req.body.rangeKm)
    }
  };
  await speciesCollection.insertOne(newSpecies);
  res.redirect("/species");
});

module.exports = {getSpecies};