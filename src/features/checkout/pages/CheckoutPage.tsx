import Stepper from "../components/Stepper";

function CheckoutPage() {
  return (
    <main className="min-h-screen bg-surface py-8 px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <Stepper />
      </div>
    </main>
  );
}

export default CheckoutPage;
