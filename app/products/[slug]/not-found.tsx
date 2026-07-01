import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-3xl font-semibold text-[#10271C] mb-3">
        Product Not Found
      </h1>
      <p className="text-[#666] mb-8">
        The product you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/#products"
        className="px-6 py-3 rounded-full font-semibold text-white"
        style={{ background: "#10271C" }}
      >
        Browse Products
      </Link>
    </div>
  );
}
