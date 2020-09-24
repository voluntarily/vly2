import React, { useEffect } from "react";
import { Table, Tag, Space } from "antd";
import TagSelect from "../Form/Input/TagSelect";
import { TagStyle } from '../VTheme/VTheme'
import AliasDisplay from './AliasDisplay'


const dataSource = [
  {
    key: "1",
    tag: "programming",
    aliases: ["development", "coding"],
    action: "x",
  },
  {
    key: "2",
    tag: "development",
    aliases: ["programming", "coding"],
    action: "x",
  },
  {
    key: "3",
    tag: "coding",
    aliases: ["programming", "development"],
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
    render: aliases => (<AliasDisplay tags={aliases}/>
    )
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

function onChange() {
  console.log("On change triggered")
}
export const TagTable = (props) => {
  return <Table dataSource={dataSource} columns={columns} />;
};
