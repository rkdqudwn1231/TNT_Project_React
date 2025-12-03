import { useEffect, useState } from "react";
import styles from "./Member.module.css";
import Pagination from 'react-bootstrap/Pagination';

const baseUsers = [
    { username: "blueberry", email: "blueberry@ac.com", reason: "Inappropriate language" },
    { username: "cute_cat", email: "cuteemail@ib.com", reason: "Spam" },
    { username: "rachel910", email: "rachelinfo@mail.com", reason: "Inappropriate language" },
    { username: "candy_love", email: "candylove@acc.com", reason: "Spam" },
    { username: "skyguy123", email: "skyguy123@abc.com", reason: "Offensive content" },
    { username: "dog_lover", email: "dog_lover@email.com", reason: "Spam" },
    { username: "princess10", email: "princess1@abc.com", reason: "Inappropriate language" },
    { username: "soccerfan", email: "soccerfan@soccerfan.com", reason: "Offensive content" },
];

const dummyBlacklist = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    ...baseUsers[i % baseUsers.length],
    createdAt: `2024-${String((i % 12) + 1).padStart(2, "0")}-01`,
}));

const Member = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    // 블랙리스트 조회
    // useEffect(() => {
    //     fetch("/api/blacklist") // ← 백엔드 API
    //         .then(res => res.json())
    //         .then(data => setUsers(data));
    // }, []);

    useEffect(() => {
        setUsers(dummyBlacklist);
    }, []);

    const itemsPerPage = 10; // ✅ 페이지당 출력 개수
    const totalPages = Math.ceil(users.length / itemsPerPage);
    // ✅ 현재 페이지 데이터만 잘라서 사용
    const startIndex = (page - 1) * itemsPerPage;
    const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);


    // 블랙리스트 해제
    const handleRemove = async (id) => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/blacklist/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("삭제 실패");
            }

            setUsers(prev => {
                const updated = prev.filter(user => user.id !== id);
                const newTotalPages = Math.ceil(updated.length / itemsPerPage);

                if (page > newTotalPages) {
                    setPage(newTotalPages || 1);
                }

                return updated;
            });

        } catch (err) {
            alert("서버 삭제 실패");
            console.error(err);
        }
    };

    const renderPagination = () => {
        let items = [];
        const maxVisible = 5; // 가운데 보여줄 최대 페이지 수
        const startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);

        // ✅ 맨 앞
        items.push(
            <Pagination.First
                key="first"
                disabled={page === 1}
                onClick={() => setPage(1)}
            />
        );

        items.push(
            <Pagination.Prev
                key="prev"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            />
        );

        // ✅ 앞쪽 생략 (...)
        if (startPage > 1) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
        }

        // ✅ 중앙 페이지들
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => setPage(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        // ✅ 뒤쪽 생략 (...)
        if (endPage < totalPages) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
        }

        items.push(
            <Pagination.Next
                key="next"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            />
        );

        items.push(
            <Pagination.Last
                key="last"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
            />
        );

        return items;
    };

    return (
        <div className={styles.admin_wrap}>
            <h2>Blacklist 관리</h2>
            
            <input type="text"></input>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>유저</th>
                        <th>이메일</th>
                        <th>가입 날짜</th>
                        <th>사유</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.reason}</td>
                            <td>
                                <button
                                    onClick={() => handleRemove(user.id)}
                                    className={styles.remove_btn}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* ✅ 페이지네이션 UI */}
            <Pagination className="justify-content-center mt-3">
                {renderPagination()}
            </Pagination>
        </div>
    );
}
export default Member;

