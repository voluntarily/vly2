import React, { useEffect } from "react";
import { Table, Tag, Space } from "antd";

const dataSource = [
  {
    key: "1",
    tag: "programming",
    aliases: "development, coding",
    action: "x",
  },
  {
    key: "2",
    tag: "development",
    aliases: "programming, coding",
    action: "x",
  },
  {
    key: "3",
    tag: "coding",
    aliases: "programming, development",
    action: "x",
  },
];

const columns = [
  {
    title: "Tag",
    dataIndex: "tag",
    key: "tag",
  },
  {
    title: "Aliases",
    dataIndex: "aliases",
    key: "aliases",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

export const TagTable = (props) => {
  return <Table dataSource={dataSource} columns={columns} />;
};
