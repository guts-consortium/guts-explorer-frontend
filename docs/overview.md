---
layout: doc
---

# Overview

## What is the ***GUTS Explorer***?

The GUTS Metadata Explorer is a browser application that allows researchers to explore the data collected during the longitudinal research project: [GUTS](https://www.gutsproject.com/). The application works with metadata, meaning there is no direct access to the research data, which is stored securely at the participating research institutes. The application allows users to filter the metadata, add the content that they are interested in to their basket, and check out the basket in order to request access to actual data content. The application was developed as a means to make the GUTS Project's research data FAIR (Findable, Accessible, Interoperable, Reusable) while simultaneously prioritising personal data privacy of research participants.

:rocket: Visit the application at https://metadata.gutsproject.com to see it in action.

The GUTS Explorer consists of (1) a Flask-based backend server, (2) Python utility scripts, and (3) a frontend web application developed with VueJS.

## The broader landscape

The GUTS Explorer forms part of a complete "shopping cart"-like workflow for requesting access to and sharing research data collected as part of the GUTS longitudinal research study (*[image source](https://gitlab.com/surf-dms/neptune_project/neptune_server/-/blob/main/waves/docs/data_flow-shopping_cart.md)*):

![shopping cart workflow](https://gitlab.com/surf-dms/neptune_project/neptune_server/-/raw/main/waves/docs/img/shoppin-cart_data-flow.png)

This workflow is enabled by the integration of a set of tools, including:

- [YODA instances](https://www.eur.nl/en/research/research-services/research-data-management/surf-yoda) that host research data at participating centers
- The [Neptune project](https://gitlab.com/surf-dms/neptune_project), developed at [SURF](https://www.surf.nl/), for serving/sharing metadata
- The [GUTS Explorer](https://metadata.gutsproject.com) that makes the research data discoverable and eventually accessible
- The [SRAM](https://www.surf.nl/en/services/surf-research-access-management) service for researcher authentication
