CREATE OR REPLACE FUNCTION notify_order_change()
RETURNS TRIGGER AS $$
DECLARE
    payload JSON;
BEGIN

    IF TG_OP = 'DELETE' THEN
        payload = json_build_object(
            'eventType', 'ORDER_DELETED',
            'data', row_to_json(OLD)
        );
    ELSIF TG_OP = 'INSERT' THEN
        payload = json_build_object(
            'eventType', 'ORDER_CREATED',
            'data', row_to_json(NEW)
        );
    ELSE
        payload = json_build_object(
            'eventType', 'ORDER_UPDATED',
            'data', row_to_json(NEW)
        );
    END IF;

    PERFORM pg_notify(
        'orders_channel',
        payload::text
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_change_trigger
AFTER INSERT OR UPDATE OR DELETE
ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_change();