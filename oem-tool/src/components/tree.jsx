import { useState } from "react";
import Tree from "react-d3-tree";
import styled from "styled-components";
import { TreeWrapper } from "./constants";






const TreeStructure = ({ data }) => {
    const createTree = (data, parentName) => {
        return data
            .filter(item => item.parentEquipment === parentName)
            .map(item => {
                const node = { name: item.equipmentName };
                const attributes = {};

                if (item.parallelComponents !== "") {
                    attributes.parallelComponents = item.parallelComponents;
                }

                if (item.repairType !== "") {
                    attributes.repairType = item.repairType;
                }

                if (item.failureMode !== "") {
                    attributes.failureMode = item.failureMode;
                }

                if (item.dutyCycle !== "") {
                    attributes.dutyCycle = item.dutyCycle;
                }

                if (Object.keys(attributes).length > 0) {
                    node.attributes = attributes;
                }

                node.children = createTree(data, item.equipmentName);

                return node;
            });
    };
    const treeData = {
        name: "parent",
        children: createTree(data, '')
    };

    console.log(treeData)

    return (
        <>
            <TreeWrapper id="treeWrapper" style={{ width: '100%', height: '30rem', marginLeft: "0.5rem" }}>
                <Tree
                    data={treeData}
                    translate={{ x: 300, y: 100 }}
                    nodeSize={{ x: 200, y: 200 }}
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                />
            </TreeWrapper>
        </>
    )
}

export default TreeStructure