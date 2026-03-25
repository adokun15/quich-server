const FLOW_STATUS_CHANGE = {
  entry: [
    {
      id: "644600416743275",
      time: 1684969340,
      changes: [
        {
          value: {
            event: "FLOW_STATUS_CHANGE",
            message: "Flow Webhook 3 changed status from DRAFT to PUBLISHED",
            flow_id: "6627390910605886",
            old_status: "DRAFT",
            new_status: "PUBLISHED",
          },
          field: "flows",
        },
      ],
    },
  ],
  object: "whatsapp_business_account",
};

/*
//Check the errors later;
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "CLIENT_ERROR_RATE",
            "message": "The flow client request error rate has reached the 5% threshold in the last 60 minutes. A higher error rate will make it harder for users to complete the flow, resulting in drop-offs.",
            "flow_id": "691244242662581",
            "error_rate": 14.28,
            "threshold": 10,
            "alert_state": "ACTIVATED",
            "errors": [
              {
                "error_type": "INVALID_SCREEN_TRANSITION",
                "error_rate": 66.66,
                "error_count": 2
              },
              {
                "error_type": "PUBLIC_KEY_MISSING",
                "error_rate": 33.33,
                "error_count": 1
              },
            ],
          },
          "field": "flows"
        }
      ]
    }
  ],
  "object": "whatsapp_business_account"
}
//eNPPOINGT
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "ENDPOINT_ERROR_RATE",
            "message": "The flow endpoint request error rate has reached the 10% threshold in the last 30 minutes. A higher error rate will make it harder for users to complete the flow, resulting in drop-offs.",
            "flow_id": "691244242662581",
            "error_rate": 14.28,
            "threshold": 10,
            "alert_state": "ACTIVATED",
            "errors": [
              {
                "error_type": "CAPABILITY_ERROR",
                "error_rate": 66.66,
                "error_count": 2
              },
              {
                "error_type": "TIMEOUT",
                "error_rate": 33.33,
                "error_count": 1
              },
            ],
          },
          "field": "flows"
        }
      ]
    }
  ],
  "object": "whatsapp_business_account"
}

//Availaiblity
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "ENDPOINT_AVAILABILITY",
            "message": "The flow endpoint availability has breached the 90% threshold in the last 10 minutes. Users will be unable to open or use the flow.",
            "flow_id": "12345678",
            "alert_state: "ACTIVATED",
            "availability": 75,
            "threshold" : 90,
          },
          "field": "flows"
        }

      ]
    }
  ],
  "object": "whatsapp_business_account"
}

//LATENCY
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "ENDPOINT_LATENCY",
            "message": "Flow endpoint latency has reached the p90 threshold in the last 30 minutes. High latency will increase the loading time between screens in the flow, impacting user experience.",
            "flow_id": "691244242662581",
            "p90_latency": 8000,
            "p50_latency": 500,
            "requests_count": 34,
            "threshold": 7000,
            "alert_state": "ACTIVATED",
          },
          "field": "flows"
        }
      ]
    }
  ],
  "object": "whatsapp_business_account"
}*/

