import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", profilePicture: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await api.register(form);
      setSession(session);
      navigate("/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-xl sm:p-8">
        <Link to="/" className="text-2xl font-black text-emerald-800">Fresh<span className="text-orange-500">Farm</span></Link>
        <p className="mt-6 font-semibold text-orange-600">Create your account</p>
        <h1 className="mt-1 text-3xl font-black">Start fresh</h1>
        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          {["name", "email", "password", "phone", "profilePicture"].map((field) => (
            <label key={field} className={`block text-sm font-bold capitalize text-slate-700 ${field === "profilePicture" ? "sm:col-span-2" : ""}`}>
              {field === "profilePicture" ? "Profile picture URL" : field}
              <input required={field !== "profilePicture"} type={field === "password" ? "password" : field === "email" ? "email" : field === "phone" ? "tel" : field === "profilePicture" ? "url" : "text"} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1.5 w-full rounded-xl border border-emerald-200 px-4 py-2.5 font-normal outline-none focus:border-emerald-600" />
            </label>
          ))}
          {error && <p className="sm:col-span-2 text-sm font-semibold text-red-600">{error}</p>}
          <button disabled={loading} type="submit" className="sm:col-span-2 w-full rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-emerald-700">Sign in</Link></p>
      </div>
    </main>
  );
};

export default Register;
