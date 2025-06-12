import Link from "next/link";

const Home: React.FC = () => {
    return (
        <div className="container px-4">
            <div className="grid grid-cols-3 gap-4">
                <Link
                    href="/erd"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        ER図
                    </div>
                </Link>
                <Link
                    href="/relation"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        リレーション
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;