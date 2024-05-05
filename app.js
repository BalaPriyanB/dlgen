const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/dl_generator', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const dlSchema = new mongoose.Schema({
  dlPath: String,
  tgLink1: String,
  tgLink2: String
}, { timestamps: true });

const DLModel = mongoose.model('DL', dlSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/dl', async (req, res) => {
  const { dlPath, tgLink1, tgLink2, pageName } = req.body;

  try {
    const newDL = new DLModel({ dlPath, tgLink1, tgLink2 });
    await newDL.save();
    res.redirect(`/dl/${newDL._id}/${pageName}`);
  } catch (err) {
    res.status(500).send('Error saving data: ' + err);
  }
});

app.get('/dl/:id/:pageName', async (req, res) => {
  const { id, pageName } = req.params;
  
  try {
    const dlData = await DLModel.findById(id);

    if (!dlData) {
      return res.status(404).send('Page not found');
    }

    res.render('dlPage', { pageName, dlData });
  } catch (err) {
    res.status(500).send('Error retrieving data: ' + err);
  }
});

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
