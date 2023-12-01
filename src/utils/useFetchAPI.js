import { useState, useEffect } from "react";

const useFetchAPI = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data - ${response.statusText}`);
                }
                const JSONData = await response.json();
                setData(JSONData);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url]);

    return { isLoading, error, data };
};

export default useFetchAPI;
