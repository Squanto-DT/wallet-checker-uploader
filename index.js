require("dotenv").config();
const { databaseToken } = process.env;
const { connect } = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const walletSchema = require("./schemas/wallet");
const Papa = require("papaparse");
const mongoose = require("mongoose");

let results = [];

async function connectDB() {
  await mongoose
    .connect(databaseToken, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
}

readCSVfiles();

async function readCSVfiles() {
  const folder = fs
    .readdirSync("./csv_files")
    .filter((file) => file.endsWith(".csv"));

  const promises = folder.map(async (file) => {
    const data = await parseCSV(`./csv_files/${file}`);
    await writeDB(data);
  });

  await Promise.all(promises);

  console.log("All CSV files have been processed and written to the database");
  process.exit(0);
}

function parseCSV(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  const results = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (results.errors.length > 0) {
    throw new Error(results.errors[0].message);
  }

  return results.data;
}

async function writeDB(data) {
  await connectDB();
  for (wallet of data) {
    console.log("Writing to db...");
    try {
      const walletProfile = await new walletSchema({
        Address: wallet.Wallet,
        Amount: wallet.MaxMint,
      });

      await walletProfile.save();
    } catch (error) {
      if (error.code !== 11000) {
        console.error(error);
      } else {
        console.log("Duplicate record, skipping...");
      }
    }
  }
  console.log("Everything was written");
}
