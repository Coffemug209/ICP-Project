import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ReportContractAbi from '../src/ReportContract.sol/ReportContract.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const contractAddress = "<CONTRACT_ADDRESS>";  // Replace with your deployed contract address

function App() {
    const [description, setDescription] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [imageHash, setImageHash] = useState<string>("");
    const [reports, setReports] = useState<any[]>([]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ReportContractAbi.abi, signer);

    const fetchReports = async () => {
        try {
            const reportCount: ethers.BigNumber = await contract.getReportCount();
            const reportArray = [];

            for (let i = 1; i <= reportCount.toNumber(); i++) {
                const report = await contract.getReport(i);
                reportArray.push(report);
            }

            setReports(reportArray);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const submitReport = async () => {
        try {
            const transaction = await contract.submitReport(description, location, imageHash);
            await transaction.wait();
            alert("Report submitted successfully!");
            fetchReports();
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    const resolveReport = async (id: number) => {
        try {
            const transaction = await contract.resolveReport(id);
            await transaction.wait();
            alert(`Report ${id} marked as resolved!`);
            fetchReports();
        } catch (error) {
            console.error("Error resolving report:", error);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_requestAccounts" });
            fetchReports();
        }
    }, []);

    return (
        <div>
            <h2>Lapor Infrastruktur Rusak</h2>
            <div>
                <input
                    type="text"
                    placeholder="Deskripsi"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Lokasi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="IPFS Image Hash"
                    value={imageHash}
                    onChange={(e) => setImageHash(e.target.value)}
                />
                <button onClick={submitReport}>Kirim Laporan</button>
            </div>

            <h3>Daftar Laporan</h3>
            <ul>
                {reports.map((report, index) => (
                    <li key={index}>
                        <p>ID: {report[0].toString()}</p>
                        <p>Deskripsi: {report[1]}</p>
                        <p>Lokasi: {report[2]}</p>
                        <p>Image Hash: <a href={`https://ipfs.io/ipfs/${report[3]}`} target="_blank" rel="noopener noreferrer">{report[3]}</a></p>
                        <p>Status: {report[5] ? "Resolved" : "Pending"}</p>
                        <button onClick={() => resolveReport(report[0].toNumber())}>Mark as Resolved</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
