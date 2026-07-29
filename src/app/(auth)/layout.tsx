import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-dark p-4 md:p-6 lg:p-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          {/* Left / Form side */}
          <div className="w-full xl:w-1/2 p-6 sm:p-12 xl:p-14">
            <div className="mb-8 block xl:hidden">
              <Link href="/">
                <Image
                  className="hidden dark:block"
                  src="/images/logo/logo.svg"
                  alt="Cloud ERP"
                  width={150}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src="/images/logo/logo-dark.svg"
                  alt="Cloud ERP"
                  width={150}
                  height={32}
                />
              </Link>
            </div>
            {children}
          </div>

          {/* Right / Hero visual side */}
          <div className="hidden w-full xl:block xl:w-1/2 p-6">
            <div className="relative overflow-hidden rounded-2xl bg-gray-1 dark:bg-dark-2 px-12 py-14 lg:px-14 min-h-[580px] flex flex-col justify-between border border-stroke dark:border-dark-3">
              {/* Decorative shapes */}
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
              
              <div className="relative z-10">
                <Link className="mb-8 inline-block" href="/">
                  <Image
                    className="hidden dark:block"
                    src="/images/logo/logo.svg"
                    alt="Cloud ERP"
                    width={176}
                    height={32}
                  />
                  <Image
                    className="dark:hidden"
                    src="/images/logo/logo-dark.svg"
                    alt="Cloud ERP"
                    width={176}
                    height={32}
                  />
                </Link>
                <p className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Cloud ERP Management System
                </p>
                <h1 className="mb-4 text-4xl font-bold text-dark dark:text-white leading-tight">
                  Welcome to Next-Gen <br/> Enterprise Solution
                </h1>
                <p className="w-full max-w-[400px] font-medium text-dark-5 dark:text-dark-6 text-sm leading-relaxed">
                  Streamline operations, track inventory, manage sales, and optimize business decisions in one unified platform.
                </p>
              </div>

              <div className="relative z-10 mt-8 flex justify-center">
                <Image
                  src="/images/grids/grid-02.svg"
                  alt="ERP Graphics"
                  width={380}
                  height={300}
                  className="opacity-50 dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}