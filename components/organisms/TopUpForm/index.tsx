import { BankTypes, NominalTypes, PaymentTypes } from "@/services/data-types";
import { useRouter } from "next/router";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NominalItem from "./NominalItem";
import PaymentItem from "./PaymentItem";

interface TopUpFormProps {
  nominals: NominalTypes[];
  payments: PaymentTypes[];
}

export default function TopUpForm(props: TopUpFormProps) {
  const { nominals, payments } = props;
  const [verifyID, setVerifyID] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [nominalItem, setNominalItem] = useState({});
  const [paymentItem, setPaymentItem] = useState({});

  const router = useRouter();

  const onNomialItemChange = (data: NominalTypes) => {
    setPaymentItem(data);
  };

  const onPaymentItemChange = (paymant: PaymentTypes, bank: BankTypes) => {
    const data = {
      paymant,
      bank,
    };
    setNominalItem(data);
  };

  const onSubmit = () => {
    if (
      verifyID === "" ||
      bankAccountName == "" ||
      Object.keys(nominalItem).length === 0 ||
      Object.keys(paymentItem).length === 0
    ) {
      toast.error("Silahkan isi semua data!");
    } else {
      const data = {
        verifyID,
        bankAccountName,
        nominalItem,
        paymentItem,
      };
      secureLocalStorage.setItem("data-topup", JSON.stringify(data));
      router.push("/checkout");
    }
  };
  return (
    <>
      <ToastContainer />
      <form action="./checkout.html" method="POST">
        <div className="pt-md-50 pt-30">
          <div className="">
            <label
              htmlFor="ID"
              className="form-label text-lg fw-medium color-palette-1 mb-10"
            >
              Verify ID
            </label>
            <input
              type="text"
              className="form-control rounded-pill text-lg"
              id="ID"
              name="ID"
              aria-describedby="verifyID"
              placeholder="Enter your ID"
              value={verifyID}
              onChange={(e) => setVerifyID(e.target.value)}
            />
          </div>
        </div>
        <div className="pt-md-50 pb-md-50 pt-30 pb-20">
          <p className="text-lg fw-medium color-palette-1 mb-md-10 mb-0">
            Nominal Top Up
          </p>
          <div className="row justify-content-between">
            {nominals.map((item) => {
              return (
                <NominalItem
                  key={item._id}
                  _id={item._id}
                  coinQuantity={item.coinQuantity}
                  coinName={item.coinName}
                  price={item.price}
                  onChange={() => onNomialItemChange(item)}
                />
              );
            })}
            <div className="col-lg-4 col-sm-6"></div>
          </div>
        </div>
        <div className="pb-md-50 pb-20">
          <p className="text-lg fw-medium color-palette-1 mb-md-10 mb-0">
            Payment Method
          </p>
          <fieldset id="paymentMethod">
            <div className="row justify-content-between">
              {payments.map((payment) => {
                return payment.banks.map((bank) => {
                  return (
                    <PaymentItem
                      key={bank._id}
                      bankId={bank._id}
                      type={payment.type}
                      name={bank.bankName}
                      onChange={() => onPaymentItemChange(payment, bank)}
                    />
                  );
                });
              })}
              <div className="col-lg-4 col-sm-6"></div>
            </div>
          </fieldset>
        </div>
        <div className="pb-50">
          <label
            htmlFor="bankAccount"
            className="form-label text-lg fw-medium color-palette-1 mb-10"
          >
            Bank Account Name
          </label>
          <input
            type="text"
            className="form-control rounded-pill text-lg"
            id="bankAccount"
            name="bankAccount"
            aria-describedby="bankAccount"
            placeholder="Enter your Bank Account Name"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
          />
        </div>
        <div className="d-sm-block d-flex flex-column w-100">
          <button
            onClick={onSubmit}
            type="button"
            className="btn btn-submit rounded-pill fw-medium text-white border-0 text-lg"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
