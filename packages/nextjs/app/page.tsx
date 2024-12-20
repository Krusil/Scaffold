"use client";
import { useState, useEffect } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth";

const HomePage = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(0);
    const [isVoting, setIsVoting] = useState(false);

    // Чтение кандидатов из контракта
    const { data: candidatesData } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getCandidates",
    });

    // Запись в контракт (голосование)
    const { writeContractAsync: vote } = useScaffoldWriteContract("YourContract");

    // Обновление списка кандидатов при изменении данных
    useEffect(() => {
        if (candidatesData) {
            const formattedCandidates = candidatesData.map(candidate => ({
                name: candidate.name,
                voteCount: candidate.voteCount.toString(),
            }));
            setCandidates(formattedCandidates);
        }
    }, [candidatesData]);

    // Обработчик события голосования
    const handleVote = async () => {
        try {
            setIsVoting(true);
            await vote({
                functionName: 'vote',
                args: [selectedCandidate],
            });
            alert("Ваш голос учтен!");
        } catch (error) {
            console.error(error);
            alert("Ошибка при голосовании. Пожалуйста, попробуйте позже.");
        } finally {
            setIsVoting(false);
        }
    };

    // Рендеринг интерфейса
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Голосование</h1>
            <div style={styles.voteSection}>
                <h2>Выберите кандидата:</h2>
                <select
                    style={styles.select}
                    onChange={(e) => setSelectedCandidate(parseInt(e.target.value))}
                >
                    {candidates.map((candidate, index) => (
                        <option key={index} value={index}>
                            {candidate.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleVote}
                    disabled={isVoting}
                    style={isVoting ? styles.buttonDisabled : styles.button}
                >
                    {isVoting ? "Голосуем..." : "Голосовать"}
                </button>
            </div>

            <div style={styles.resultsSection}>
                <h2>Результаты голосования</h2>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.tableHeader}>Кандидат</th>
                        <th style={styles.tableHeader}>Количество голосов</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td style={styles.tableCell}>{candidate.name}</td>
                            <td style={styles.tableCell}>{candidate.voteCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Стили
const styles = {
    container: {
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        textAlign: "center",
        fontSize: "2rem",
        marginBottom: "20px",
    },
    voteSection: {
        marginBottom: "30px",
    },
    select: {
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        marginBottom: "10px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    buttonDisabled: {
        width: "100%",
        padding: "10px",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "not-allowed",
        fontSize: "16px",
    },
    resultsSection: {
        marginTop: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHeader: {
        borderBottom: "2px solid #000",
        textAlign: "center",
        padding: "10px",
        backgroundColor: "green",
    },
    tableCell: {
        borderBottom: "1px solid #ccc",
        padding: "10px",
        textAlign: "center",
    },
};

export default HomePage;
