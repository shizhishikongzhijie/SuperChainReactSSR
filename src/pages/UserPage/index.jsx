import React from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';

function User() {

    return (

        <div className="user" style={{ marginTop: "6rem", backgroundColor: "#fafafa" }}>
            {/* 公钥
            私钥
            助记词 */}
            <Row gutter={[16, 16]}>
                <Col span={6} gutter={[16, 16]} >
                    <Row gutter={[16, 16]}>
                        <Card bordered={false}>
                            <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
                            <Button
                                style={{
                                    marginTop: 16,
                                }}
                                type="primary"
                            >
                                Recharge
                            </Button>
                        </Card>
                        <Card bordered={false}>
                            <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
                            <Button
                                style={{
                                    marginTop: 16,
                                }}
                                type="primary"
                            >
                                Recharge
                            </Button>
                        </Card>
                    </Row>
                </Col>
                <Col span={18} >
                </Col>
            </Row>
        </div>

    );
}

export default User;