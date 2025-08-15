import withAuth from '../components/withAuth';

function Contact() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Contact Us</h1>
      <p>Get in touch with the FalconTrade team.</p>
    </div>
  );
}

export default withAuth(Contact);
