import React from "react";
import CreateAnnonceForm from "../components/CreateAnnonceForm";

const CreateAnnonce = () => (
  <div className="p-8 flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-4">Créer une annonce</h2>
    <CreateAnnonceForm />
  </div>
);
export default CreateAnnonce;
