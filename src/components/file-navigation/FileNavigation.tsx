import React, { useState } from 'react';
import { SimpleTreeView, TreeItem, TreeItemProps } from '@mui/x-tree-view';
import { Collapse, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';

type File = {
  name: string;
  type: 'file';
};

type Folder = {
  name: string;
  type: 'folder';
  children: Array<File | Folder>;
};

const StyledTreeItem = styled((props: TreeItemProps) => <TreeItem {...props} />)(({ theme }) => ({
  '& .MuiTreeItem-content': {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  '& .MuiTreeItem-label': {
    fontSize: '1rem',
  },
  '& .MuiTreeItem-group': {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    borderLeft: `1px dashed ${theme.palette.divider}`,
  },
}));

const AnimatedCollapse = styled(Collapse)({
  '& .MuiCollapse-wrapperInner': {
    transition: 'opacity 0.3s',
  },
});

const fileStructure: Array<Folder> = [
  {
    name: 'Root',
    type: 'folder',
    children: [
      {
        name: 'Folder 1',
        type: 'folder',
        children: [
          { name: 'File 1.1', type: 'file' },
          { name: 'File 1.2', type: 'file' },
        ],
      },
      {
        name: 'Folder 2',
        type: 'folder',
        children: [
          { name: 'File 2.1', type: 'file' },
          { name: 'File 2.2', type: 'file' },
        ],
      },
    ],
  },
];

const renderTree = (nodes: Array<File | Folder>) =>
  nodes.map((node) => (
    <StyledTreeItem
      key={node.name}
      itemId={node.name}
      label={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {node.type === 'folder' ? (
            <FolderIcon color="primary" style={{ marginRight: 8 }} />
          ) : (
            <FileIcon color="action" style={{ marginRight: 8 }} />
          )}
          <Typography variant="body1">{node.name}</Typography>
        </div>
      }
    >
      {node.type === 'folder' && renderTree(node.children)}
    </StyledTreeItem>
  ));

const FileNavigation = ({ structure }: { structure: Array<Folder> }) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds);
  };

  return (
    <SimpleTreeView
      slots={{
        expandIcon: ChevronRightIcon,
        collapseIcon: ExpandMoreIcon,
      }}
      expandedItems={expanded}
      onExpandedItemsChange={handleToggle}
    >
      <AnimatedCollapse in={true} timeout={300}>
        {renderTree(structure)}
      </AnimatedCollapse>
    </SimpleTreeView>
  );
};

export default function FileNavigationWrapper() {
  return <FileNavigation structure={fileStructure} />;
}
