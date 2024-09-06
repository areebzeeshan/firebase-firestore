import { Button, IconButton, Stack, TextField } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebase/firebase";
import { Delete as DeleteIcon } from "@mui/icons-material";

function App() {
  const [data, setData] = useState([]);
  const [cafe, setCafe] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const response = await addDoc(collection(db, "cafes"), {
        cafe: cafe,
        city: city,
      });
      if (response) {
        console.log("Data added successfully!");
      }
    } catch (error) {
      console.log("Error in addind data: ", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "cafes", id))
      console.log(`Document with id: ${id} deleted successfully!`)
      getData()
    } catch (error) {
      console.log("Error in deleting doc:", error)
    }
  }

  const getData = async () => {
    try {
      const response = await getDocs(collection(db, "cafes"));
      const dataCollection = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(dataCollection)
      setData(dataCollection);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex justify-center h-[100vh] items-center bg-[#212020] text-white">
      <div className="w-[60%]">
        <h1 className="text-center text-4xl font-semibold">Cloud Cafe</h1>
        <div className="my-7 bg-white rounded-lg p-5 text-black">
          <Stack
            component={"form"}
            onSubmit={handleSumbit}
            direction={"row"}
            spacing={"1rem"}
          >
            <TextField
              name="cafe"
              type="text"
              label="Cafe"
              value={cafe}
              onChange={(e) => setCafe(e.target.value)}
              className="w-[100%]"
            />
            <TextField
              name="city"
              type="text"
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-[100%]"
            />
            <Button type="submit" variant="contained" className="w-[100%]">
              Submit
            </Button>
          </Stack>
          <Stack direction={"column"} spacing={"1rem"} padding={"1rem"}>
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              data.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-200 rounded-lg w-full p-3 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{item.cafe}</p>
                    <p>{item.city}</p>
                  </div>
                  <IconButton onClick={() => deleteData(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))
            )}
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default App;
