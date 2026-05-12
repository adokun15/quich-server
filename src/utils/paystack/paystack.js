import CustomError from "../error/error.js";

//Post, update
export async function paystack(config, data) {
  try {
    const option = {
      method: config?.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({ ...data }),
    };

    const paystack = await fetch(
      `${process.env.PAYSTACK_URL}${config?.endpoint}`,
      option,
    );

    const response = await paystack.json();

    if (!response.status) {
      throw new CustomError(response.message || "SOMETHING WENT WRONG!", 500);
    }

    return response;
  } catch (err) {
    throw new CustomError(err?.message || "Something went wrong", 500);
  }
}
export async function paystack_(config) {
  try {
    const option = {
      method: config?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    const paystack = await fetch(
      `${process.env.PAYSTACK_URL}${config?.endpoint}`,
      option,
    );

    const response = await paystack.json();

    if (!response.status) {
      throw new CustomError(response.message || "SOMETHING WENT WRONG!", 500);
    }

    return response;
  } catch (err) {
    throw new CustomError(err?.message || "Something went wrong", 500);
  }
}
