import { text } from "express";
import { WhatsappUrlForMessages } from "../../whatsapp";

export const WhatsappInteractiveUrlButton = async ({
  phone = null,
  header_content = {
    document_header: null,
    image_header: null,
    text_header: null,
    video_header: null,
  },
  action_content = { display_text: "", url: "" },
  body_content = null, //String
  footer_content = null, //String
}) => {
  let interactive = {
    type: "cta_url",
  };

  //Headers
  if (header_content?.document_header) {
    interactive.header = {
      type: "document",
      document: {
        //id(on Meta) / link(hosted)
        link: header_content?.document_header,
      },
    };
  }
  if (header_content?.image_header) {
    interactive.header = {
      type: "image",
      image: {
        //id(on Meta) / link(hosted)
        link: header_content?.image_header,
      },
    };
  }

  if (header_content?.video_header) {
    interactive.header = {
      type: "video",
      video: {
        //id(on Meta) / link(hosted)
        link: header_content?.video_header,
      },
    };
  }

  if (header_content?.text_header) {
    interactive.header = {
      type: "text",
      text: header_content?.text_header,
    };
  }

  //Footer
  if (footer_content) {
    interactive.footer = {
      text: footer_content,
    };
  }

  //Action
  interactive.action = {
    name: "cta_url",
    parameters: { ...action_content },
  };

  //Body
  interactive.body = {
    text: body_content,
  };

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `+234${phone}`,
    type: "interactive",
    interactive,
  };

  const api_endpoint = await WhatsappUrlForMessages({ payload });

  //{status: 'success' | 'error', message: if 'failed'}
  return api_endpoint;
};

export const WhatsappInteractiveListButton = async ({
  phone = null,
  header_text = "",
  body_text = "",
  footer_text = "",
  action_button_text = "",
  sections_list = [],
}) => {
  /*
    let sections = []
    for (const section of sections_list) {
        let rows = [];

       for (const row of r){
        rows.push({
            id: row?.row_id,
            title: row?.row_title,
            description: row?.row_description,
           })
           }
           
           sections.push({
        title: section?.section?.title,
        rows
      })
    }
*/

  let interactive = {
    type: "list",
    header: {
      type: "text",
      text: header_text,
    },
    body: {
      text: body_text,
    },
    footer: {
      text: footer_text,
    },
    action: {
      button: action_button_text,
      sections: sections_list,
    },
  };
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `+234${phone}`,
    type: "interactive",
    interactive,
  };

  const api_endpoint = await WhatsappUrlForMessages({ payload });

  //{status: 'success' | 'error', message: if 'failed'}
  return api_endpoint;
};

export const WhatsappInteractiveReplyButton = async ({
  phone = null,
  body_text = "",
  footer_text = "",
  action_button_text = "",
  header_content = {
    document_header: null,
    image_header: null,
    text_header: null,
    video_header: null,
  },
}) => {
  let interactive = {
    type: "button",
  };

  //Headers
  if (header_content?.document_header) {
    interactive.header = {
      type: "document",
      document: {
        //id(on Meta) / link(hosted)
        id: header_content?.document_header,
      },
    };
  }
  if (header_content?.image_header) {
    interactive.header = {
      type: "image",
      image: {
        //id(on Meta) / link(hosted)
        id: header_content?.image_header,
      },
    };
  }

  if (header_content?.video_header) {
    interactive.header = {
      type: "video",
      video: {
        //id(on Meta) / link(hosted)
        id: header_content?.video_header,
      },
    };
  }

  if (header_content?.text_header) {
    interactive.header = {
      type: "text",
      text: header_content?.text_header,
    };
  }

  interactive.body = {
    text: body_text,
  };

  interactive.footer = {
    text: footer_text,
  };

  interactive.action = {
    button: action_button_text,
    sections: sections_list,
  };
  /*
[ {type: 'reply', reply: {id: '', title: ''}, } ]
*/

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `+234${phone}`,
    type: "interactive",
    interactive,
  };

  const api_endpoint = await WhatsappUrlForMessages({ payload });

  //{status: 'success' | 'error', message: if 'failed'}
  return api_endpoint;
};
