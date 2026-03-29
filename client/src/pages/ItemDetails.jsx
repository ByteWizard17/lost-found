import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <div className="container">Loading...</div>;

  return (
    <div className="container">

      <div className="card">

        <h2>{item.name || item.title}</h2>

        {item.image && (
          <img
            src={item.image}
            alt={item.name || item.title}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "15px"
            }}
          />
        )}

        <p>
          <strong>Description:</strong> {item.description}
        </p>

        <p>
          <strong>Location:</strong> {item.location}
        </p>

        <p>
          <strong>Type:</strong> {item.type || "Lost"}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {item.date ? new Date(item.date).toLocaleDateString() : "Not available"}
        </p>

        {item.contact && (
          <p>
            <strong>Contact:</strong> {item.contact}
          </p>
        )}

      </div>

    </div>
  );
};

export default ItemDetails;