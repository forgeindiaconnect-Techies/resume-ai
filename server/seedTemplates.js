const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Template = require('./models/Template');
const ResumeLayout = require('./models/ResumeLayout');

dotenv.config();

const DB_PATH = path.join(__dirname, 'database.json');

(async () => {
  const templatesData = [
    {
      name: "Modern Blue",
      industry: "General",
      category: "Professional",
      description: "Modern professional blue resume template.",
      thumbnail: "/templates/software.jpg",
      atsScore: 98,
    },
    {
      name: "Software Engineer",
      industry: "Software Engineering",
      category: "Technology",
      description: "Perfect for software developers.",
      thumbnail: "/templates/software.jpg",
      atsScore: 98,
    },
    {
      name: "Data Analyst",
      industry: "Data Science",
      category: "Technology",
      description: "Professional data analyst resume.",
      thumbnail: "/templates/data.jpg",
      atsScore: 96,
    },
    {
      name: "Marketing Manager",
      industry: "Marketing",
      category: "Business",
      description: "Creative marketing resume.",
      thumbnail: "/templates/marketing.jpg",
      atsScore: 95,
    },
    {
      name: "Teacher",
      industry: "Education",
      category: "Education",
      description: "Modern teacher resume.",
      thumbnail: "/templates/teacher.jpg",
      atsScore: 94,
    },
    {
      name: "Accountant",
      industry: "Finance",
      category: "Finance",
      description: "Professional finance resume.",
      thumbnail: "/templates/accountant.jpg",
      atsScore: 97,
    }
  ];

  try {
    console.log("Attempting MongoDB Connection...");
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environmental variable is not defined.');
    }

    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB Connected successfully");

    // Clear existing templates
    await Template.deleteMany({});
    
    // Create Layout
    const layout = await ResumeLayout.create({
      layout: "Modern",
      columns: 2,
      header: "center",
      sidebar: "left",
      color: "#2563EB",
      font: "'Poppins', sans-serif",
      fontSize: "medium"
    });

    const populatedTemplates = templatesData.map(t => ({ ...t, layout: layout._id }));
    await Template.insertMany(populatedTemplates);
    console.log("Templates Seeded into MongoDB successfully!");

  } catch (error) {
    console.warn("MongoDB connection failed or refused. Seeding locally into database.json instead.");
    console.error("Connection Error detail:", error.message);

    // Seed locally
    const localLayout = {
      _id: "layout_mock_id_123",
      layout: "Modern",
      columns: 2,
      header: "center",
      sidebar: "left",
      color: "#2563EB",
      font: "'Poppins', sans-serif",
      fontSize: "medium"
    };

    const localTemplates = templatesData.map((t, idx) => ({
      _id: `template_mock_id_${idx + 1}`,
      ...t,
      layout: localLayout,
      isPremium: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    try {
      const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
      data.templates = localTemplates;
      data.layouts = [localLayout];
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
      console.log("Templates Seeded locally into database.json successfully!");
    } catch (fsErr) {
      console.error("Local file writing failed:", fsErr.message);
    }

  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit();
  }
})();
