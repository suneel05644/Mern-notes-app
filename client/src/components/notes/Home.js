import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import _ from "lodash";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [filteredData, setFilteredData] = useState(notes);
  const [token, setToken] = useState("");

  const getNotes = async (token) => {
    const res = await axios.get("api/notes", {
      headers: { Authorization: token },
    });
    setNotes(res.data);
  };

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    console.log(value);
    result = notes.filter((data) => {
      return data.title.search(value) !== -1;
    });
    setFilteredData(result);
  };

  useEffect(() => {
    const token = localStorage.getItem("tokenStore");
    setToken(token);
    if (token) {
      getNotes(token);
    }
  }, []);

  // const styles = {
  //   display: "inline",
  //   width: "30%",
  //   height: 50,
  //   float: "left",
  //   padding: 5,
  //   border: "0.5px solid black",
  //   marginBottom: 10,
  //   marginRight: 10,
  // };

  const deleteNote = async (id) => {
    try {
      if (token) {
        await axios.delete(`api/notes/${id}`, {
          headers: { Authorization: token },
        });
        getNotes(token);
      }
    } catch (error) {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <div style={{ marginLeft: "44%" }}>
        <div style={{ margin: "0 auto", marginTop: "5%" }}>
          <label>Search:</label>
          <input type="text" onChange={(event) => handleSearch(event)} />
        </div>
        <div style={{ padding: 10 }}>
          {filteredData.map((value) => {
            return (
              <div key={value._id}>
                <div className="card">{value.title}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="note-wrapper">
        {_.sortBy(notes, ["title", "start_date"]).map((note) => (
          <div className="card" key={note._id}>
            <h4 title={note.title}>{note.title}</h4>
            <div className="text-wrapper">
              <p>{note.content}</p>
            </div>
            <p className="date">{format(note.date)}</p>
            <div className="card-footer">
              {note.name}
              <Link to={`edit/${note._id}`}>Edit</Link>
            </div>
            <button className="close" onClick={() => deleteNote(note._id)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
