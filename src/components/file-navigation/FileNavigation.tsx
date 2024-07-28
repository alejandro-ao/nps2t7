import React, { useState, useEffect } from 'react';
import { SimpleTreeView, TreeItem, TreeItemProps } from '@mui/x-tree-view';
import {
  Collapse,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

type File = {
  name: string;
  type: 'file';
};

type Folder = {
  name: string;
  type: 'folder';
  children: Array<File | Folder>;
};

const API_URL = 'http://localhost:8000';

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

const FileNavigation = () => {
  const [fileSystem, setFileSystem] = useState<Folder | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit'>('create');
  const [dialogItemType, setDialogItemType] = useState<'file' | 'folder'>('file');
  const [dialogItemName, setDialogItemName] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    fetchFileSystem();
  }, []);

  const fetchFileSystem = async () => {
    try {
      console.log('fetching data');
      const response = await axios.get(`${API_URL}/files`);
      console.log(response);
      setFileSystem(response.data.root);
    } catch (error) {
      console.error('Error fetching file system:', error);
    }
  };

  const handleToggle = (event: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds);
  };

  const handleCreate = (path: string, type: 'file' | 'folder') => {
    setDialogType('create');
    setDialogItemType(type);
    setDialogItemName('');
    setCurrentPath(path);
    setDialogOpen(true);
  };

  const handleEdit = (path: string, name: string, type: 'file' | 'folder') => {
    setDialogType('edit');
    setDialogItemType(type);
    setDialogItemName(name);
    setCurrentPath(path);
    setDialogOpen(true);
  };

  const handleDelete = async (path: string, name: string) => {
    try {
      await axios.delete(`${API_URL}/files/${name}?path=${path.replace(/^\/Root/, '')}`);
      fetchFileSystem();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDialogSubmit = async () => {
    try {
      const payload =
        dialogItemType === 'folder'
          ? {
              name: dialogItemName,
              type: 'folder' as const,
              children: [],
            }
          : {
              name: dialogItemName,
              type: 'file' as const,
            };

      if (dialogType === 'create') {
        await axios.post(`${API_URL}/files`, payload, {
          params: { path: currentPath.replace(/^\/Root/, '') },
        });
      } else {
        await axios.put(
          `${API_URL}/files/${dialogItemName}?path=${currentPath.replace(/^\/Root/, '')}`,
          payload
        );
      }
      setDialogOpen(false);
      fetchFileSystem();
    } catch (error) {
      console.error('Error submitting dialog:', error);
    }
  };

  const renderTree = (node: Folder | File, path: string) => (
    <StyledTreeItem
      key={node.name}
      itemId={`${path}/${node.name}`}
      label={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {node.type === 'folder' ? (
              <FolderIcon color="primary" style={{ marginRight: 8 }} />
            ) : (
              <FileIcon color="action" style={{ marginRight: 8 }} />
            )}
            <Typography variant="body1">{node.name}</Typography>
          </div>
          <div>
            {node.type === 'folder' && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreate(`${path}/${node.name}`, 'file');
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(path, node.name, node.type);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(path, node.name);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      }
    >
      {node.type === 'folder' &&
        node.children &&
        node.children.map((childNode) => renderTree(childNode, `${path}/${node.name}`))}
    </StyledTreeItem>
  );

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleCreate('', 'folder')}
        style={{ marginBottom: 16 }}
      >
        Add Root Folder
      </Button>
      {fileSystem && (
        <SimpleTreeView
          slots={{
            expandIcon: ChevronRightIcon,
            collapseIcon: ExpandMoreIcon,
          }}
          expandedItems={expanded}
          onExpandedItemsChange={handleToggle}
        >
          <AnimatedCollapse in={true} timeout={300}>
            {renderTree(fileSystem, '')}
          </AnimatedCollapse>
        </SimpleTreeView>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogType === 'create' ? 'Create' : 'Edit'} {dialogItemType}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={dialogItemName}
            onChange={(e) => setDialogItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDialogSubmit}>
            {dialogType === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileNavigation;
