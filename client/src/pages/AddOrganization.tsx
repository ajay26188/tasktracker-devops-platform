import { useState } from "react";
import organizationService from "../services/organization";
import axios from "axios";
import { useDispatch } from "react-redux";
import { alertMessageHandler } from "../reducers/alertMessageReducer";
import type { AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/layouts/FormLayout";

const AddOrganization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrg = await organizationService.add({ name });
      setOrgId(newOrg.id);

      dispatch(
        alertMessageHandler(
          { message: "Organization created successfully!", type: "success" },
          5
        )
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler(
            { message: error.response.data.error, type: "error" },
            5
          )
        );
      }
    }
  };

  if (orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="w-96 bg-white p-10 rounded-3xl shadow-2xl space-y-6 text-center">
          <h1 className="text-3xl font-bold text-green-600">
            Organization Created!
          </h1>

          <p className="text-gray-700">
            This <span className="font-semibold">Organization ID</span> is required
            for you and your employees to sign up.
          </p>

          <div className="font-mono text-lg bg-gray-100 p-3 rounded border">
            {orgId}
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(orgId)}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            📋 Copy Organization ID
          </button>

          <p className="text-sm text-gray-500">
            Share this ID with your employees so they can join your organization.
          </p>

          <button
            onClick={() => navigate("/signup", { state: { orgId } })}
            className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Continue to Signup
          </button>
        </div>
      </div>
    );
  }

  // Creation form wrapped with FormLayout
  return (
    <FormLayout
      title="Create Organization"
      onSubmit={handleAddOrganization}
      fields={
        <input
          type="text"
          placeholder="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
          required
        />
      }
      actions={
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
        >
          Create Organization
        </button>
      }
    />
  );
};

export default AddOrganization;
