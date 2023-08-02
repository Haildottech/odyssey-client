import React from "react";
import { Row, Col, Spinner, Form } from "react-bootstrap";
import { Radio, Modal, Select } from "antd";
import Table from "./Table";

const Ledger = ({
  state,
  dispatch,
  handleSubmit,
  getDebitCredit,
  balance,
  getOpeningBalance,
  getClosingBalance,
  computedBalance,
}) => {
  const { records, visible, load, from, to, company } = state;
  return (
    <div className="base-page-layout">
      <Row>
        <Col md={12} xs={12}>
          <h4 className="fw-7"> Ledger</h4>
        </Col>
        <Col md={12}>
          <hr />
        </Col>
        <Col md={3} className="mt-3">
          <div>From</div>
          <Form.Control
            type={"date"}
            size="sm"
            value={from}
            onChange={(e) =>
              dispatch({ type: "SET_DATA", payload: { from: e.target.value } })
            }
          />
        </Col>
        <Col md={3} className="mt-3">
          <div>To</div>
          <Form.Control
            type={"date"}
            size="sm"
            value={to}
            onChange={(e) =>
              dispatch({ type: "SET_DATA", payload: { to: e.target.value } })
            }
          />
        </Col>
        <Col md={6} className="py-5"></Col>
        <Col md={4} className="mb-3">
          <div>Company</div>
          <Radio.Group
            className="mt-1"
            value={company}
            onChange={(e) =>
              dispatch({
                type: "SET_DATA",
                payload: { company: e.target.value },
              })
            }
          >
            <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
            <Radio value={2}>CARGO LINKERS</Radio>
            <Radio value={3}>AIR CARGO SERVICES</Radio>
          </Radio.Group>
        </Col>
        <Col md={8}></Col>
        <Col md={4}>
          <div> Accounts</div>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Account"
            onChange={(e) =>
              dispatch({ type: "SET_DATA", payload: { account: e } })
            }
            options={records}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Col>
      </Row>
      <button
        className="btn-custom mt-3"
        disabled={load ? true : false}
        onClick={handleSubmit}
      >
        {load ? <Spinner size="sm" className="mx-3" /> : "Search"}
      </button>
      <Modal
        open={visible}
        width={"70%"}
        onOk={() => dispatch({ type: "SET_DATA", payload: { visible: false } })}
        onCancel={() =>
          dispatch({ type: "SET_DATA", payload: { visible: false } })
        }
        footer={false}
        maskClosable={false}
        title={`Vouchers`}
      >
        <Table
          getDebitCredit={getDebitCredit}
          balance={balance}
          state={state}
          getOpeningBalance={getOpeningBalance}
          computedBalance={computedBalance}
        />
      </Modal>
    </div>
  );
};
export default Ledger;
