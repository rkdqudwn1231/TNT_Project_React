import AgeChart from "./Chart/AgeChart";
import BodyTypeChart from "./Chart/BodyTypeChart";
import GenderChart from "./Chart/GenderChart";
import UsageChart from "./Chart/UsageChart";
import styles from "./Manage.module.css";
import { Container, Row, Col } from "react-bootstrap";

const Manage = () => {
    const ageData = [
        { age: "10s", value: 20 },
        { age: "20s", value: 35 },
        { age: "30s", value: 25 },
        { age: "40s", value: 18 },
        { age: "50s", value: 12 },
    ];


    return (
        <Container fluid >
            <Row>
                <Col xs={12} md={6} className={styles.manage_layout}>
                   <AgeChart />
                </Col>

                <Col xs={12} md={6}  className={styles.manage_layout}>
                  <GenderChart />
                </Col>

                <Col xs={12} md={6}  className={styles.manage_layout}>
                   <BodyTypeChart />
                </Col>
                <Col xs={12} md={6}  className={styles.manage_layout}>
                   
                   <UsageChart />
                </Col>
            </Row>
        </Container>
    );
}
export default Manage;