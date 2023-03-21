import React, { useState, useEffect} from "react"; 
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {v4 as uuid} from "uuid";
import './App.css';
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail"
import api from "../api/contacts"
import EditContact from "./EditContact";

function App() {
  //const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const addContactHandler = async (contact) => {
    const request = {id : uuid(), ...contact};
    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const {id} = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? {...response.data} : contact;
      })
    );
  }
  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if(searchTerm !== ""){
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
      });
      setSearchResult(newContactList);
    }else{
      setSearchResult(contacts);
    }
  }
  const retriveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  }

  const removeContactHandler = async (id) => {
      await api.delete(`/contacts/${id}`);
      const newContactList = contacts.filter((contact) => {
        return contact.id !== id;
      });
      setContacts(newContactList);
      //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newContactList));
  }

  useEffect(() => {
    const getAllContacts = async () => {
       const allContacts = await retriveContacts();
       if(allContacts) setContacts(allContacts);
    }
    getAllContacts();
  }, []);

  useEffect(() => {
      //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      <BrowserRouter>
        <Header />
          <Switch>
            <Route exact path="/" render={(props) => (
              <ContactList {...props} 
              contacts={searchTerm.length < 1 ? contacts : searchResult}
              getcontactId={removeContactHandler}
              term={searchTerm}
              searchKeyWord = {searchHandler} />
            )} />
            <Route path="/add" render={(props) => (
              <AddContact {...props} addContactHandler={addContactHandler} />
            )} />
            <Route path="/edit" render={(props) => (
              <EditContact {...props} updateContactHandler={updateContactHandler} />
            )} />

            <Route path="/contact/:id" component={ContactDetail} />
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
 