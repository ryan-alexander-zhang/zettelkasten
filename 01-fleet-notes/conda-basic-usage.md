---
tags:
  - conda
id: 20251201110925
created: 2025-12-01
reviewed: false
status:
  - in_progress
type: fleet-note
---

```sh
# Search for the available Python version.
conda search python

# create environment
conda create -n <name> python=<version>

# install packages
conda search <package>
conda install --name <name> <package>=<version>

# check envs
conda env list
# active env
conda activate <name>
conda deactivate <name>
```

# References

* [Conda Documentation — conda 25.11.0 documentation](https://docs.conda.io/projects/conda/en/stable/)

# Link to