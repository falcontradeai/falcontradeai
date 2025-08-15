import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import withAuth from '../components/withAuth';

function Profile() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          withCredentials: true,
        });
        setCompanyName(res.data.companyName || '');
        setCompanyWebsite(res.data.companyWebsite || '');
        setLogoUrl(res.data.logoUrl || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('companyWebsite', companyWebsite);
      if (logo) {
        formData.append('logo', logo);
      }
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setLogoUrl(res.data.logoUrl || '');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Company Website"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
        {logoUrl && (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${logoUrl}`}
            alt="Company Logo"
            className="h-24"
          />
        )}
        <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

export default withAuth(Profile);
