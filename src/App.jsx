import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebase/firebase";

function App() {
  const [data, setData] = useState([]);
  const [cafe, setCafe] = useState("");
  const [city, setCity] = useState("");
  const [updateCafe, setUpdateCafe] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)

  const handleSubmit = async (e) => {
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
      console.log("Error in adding data: ", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "cafes", id));
      console.log(`Document with id: ${id} deleted successfully!`);
    } catch (error) {
      console.log("Error in deleting doc:", error);
    }
  };

  const getData = () => {
    try {
      onSnapshot(collection(db, "cafes"), (snapShot) => {
        const dataCollection = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataCollection);
        setLoading(false);
      });

    } catch (error) {
      console.log("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const fetchingDoc = async (item) => {
    try {
      const fetchDoc = await getDoc(doc(db, "cafes", item.id))
      const fetcheddata = fetchDoc.data()
      setUpdateCafe(fetcheddata.cafe)
      setUpdateCity(fetcheddata.city)
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  }

  const handleOpenEditModal = (item) => {
    setOpenEditModal(true);
    fetchingDoc(item)
    setSelectedItem(item);
  }

  const handleUpdateData = async (e) => {
    e.preventDefault()
    if (!selectedItem) return;

    try {
      await updateDoc(doc(db, "cafes", selectedItem.id), {
        cafe: updateCafe,
        city: updateCity,
      })
      console.log("Data updated successfully!")
      setOpenEditModal(false);
    } catch (error) {
      console.log("Error updating data: ", error);
    }
  }

  const handleClose = () => {
    setOpenEditModal(false);
  }

  return (
    <div className="flex justify-center h-[100vh] items-center bg-[#212020] text-white">
      <div className="w-[60%]">
        <h1 className="text-center text-4xl font-semibold">Cloud Cafe</h1>
        <div className="my-7 bg-white rounded-lg p-5 text-black">
          <Stack
            component={"form"}
            onSubmit={handleSubmit}
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
                  <div>
                    <IconButton onClick={() => handleOpenEditModal(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteData(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))
            )}

            {/* update modal */}
            <Dialog
              maxWidth="md"
              fullWidth={true}
              open={openEditModal}
              onClose={handleClose}
            >
              <DialogTitle>Update</DialogTitle>
              <DialogContent>
                <Stack component={'form'} onSubmit={handleUpdateData} spacing={2}>
                  <TextField
                    name="cafe-update"
                    type="text"
                    label="Cafe"
                    value={updateCafe}
                    onChange={(e) => setUpdateCafe(e.target.value)}
                    className="w-[100%]"
                  />
                  <TextField
                    name="city-update"
                    type="text"
                    label="City"
                    value={updateCity}
                    onChange={(e) => setUpdateCity(e.target.value)}
                    className="w-[100%]"
                  />
                  <Button type="submit" variant="contained" className="w-[100%]">
                    Update
                  </Button>
                </Stack>
              </DialogContent>
            </Dialog>
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default App;
