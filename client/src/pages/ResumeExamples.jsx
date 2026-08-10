import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Eye, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const ResumeExamples = () => {
  const navigate = useNavigate();

  const [examples, setExamples] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/examples");
      setExamples(response.data.examples || []);
    } catch (error) {
      console.error("Failed to fetch examples:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExamples = examples.filter((example) =>
    `${example.title} ${example.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="examples-page">
        {/* Header */}
        <div className="examples-header">
          <button
            className="examples-back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div>
            <h1>Resume Examples</h1>
            <p>
              Explore professional resume examples and get inspired for your own
              resume.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="examples-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search resume examples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="examples-message">Loading examples...</div>
        ) : filteredExamples.length === 0 ? (
          <div className="examples-message">
            <FileText size={45} />
            <h3>No resume examples available</h3>
            <p>Please check again later.</p>
          </div>
        ) : (
          <div className="examples-grid">
            {filteredExamples.map((example) => (
              <div className="example-card" key={example._id}>
                <div className="example-preview">
                  {example.previewImage ? (
                    <img src={example.previewImage} alt={example.title} />
                  ) : (
                    <FileText size={45} />
                  )}
                </div>

                <div className="example-card-content">
                  <div>
                    <h3>{example.title}</h3>
                    <span>{example.category}</span>
                  </div>

                  <p>{example.description}</p>

                  <button
                    className="example-view-button"
                    onClick={() => navigate(`/resume-examples/${example._id}`)}
                  >
                    <Eye size={16} />
                    View Example
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ResumeExamples;
